"""
Copyright (C) 2020 

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 2.0 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.

Please see the README.md in the project root directory for a list
of all authors for this project.
"""
import logging
from builtins import getattr

import mock
import pytest
from six import PY3

from dtale.cli.clickutils import loader_options, setup_logging

if PY3:
    from contextlib import ExitStack
else:
    from contextlib2 import ExitStack


@pytest.mark.unit
def test_setup_logging():

    with ExitStack() as stack:
        mock_fh = stack.enter_context(mock.patch('logging.FileHandler', mock.Mock()))
        mock_lbc = stack.enter_context(mock.patch('logging.basicConfig', mock.Mock()))
        stack.enter_context(mock.patch('sys.argv', ['test']))
        stack.enter_context(mock.patch('socket.gethostname', mock.Mock(return_value='test')))
        mock_linf = stack.enter_context(mock.patch('logging.info', mock.Mock()))
        stack.enter_context(mock.patch('logging.getLogger', mock.Mock()))
        setup_logging(None, None)
        mock_fh.assert_not_called()
        mock_lbc.has_call(mock.call(format="%(asctime)s - %(levelname)-8s - %(message)s", level=logging.INFO))
        mock_linf.has_call(mock.call('test'))
        mock_linf.has_call(mock.call('Hostname: test'))

    with ExitStack() as stack:
        mock_fh = stack.enter_context(mock.patch('logging.FileHandler', mock.Mock()))
        mock_lbc = stack.enter_context(mock.patch('logging.basicConfig', mock.Mock()))
        stack.enter_context(mock.patch('logging.getLogger', mock.Mock()))
        stack.enter_context(mock.patch('sys.argv', ['test']))
        stack.enter_context(mock.patch('socket.gethostname', mock.Mock(return_value='test')))
        setup_logging('test_log', None, verbose=True)
        mock_fh.assert_called_once()
        mock_lbc.has_call(mock.call(format="%(asctime)s - %(levelname)-8s - %(message)s", level=logging.DEBUG))

        for level in ['debug', 'info', 'warning', 'error', 'critical'][::-1]:
            setup_logging(None, level)
            mock_lbc.has_call(
                mock.call(format="%(asctime)s - %(levelname)-8s - %(message)s", level=getattr(logging, level.upper()))
            )

    with ExitStack() as stack:
        mock_fh = stack.enter_context(mock.patch('logging.FileHandler', mock.Mock()))
        mock_lbc = stack.enter_context(mock.patch('logging.basicConfig', mock.Mock()))
        stack.enter_context(mock.patch('logging.getLogger', mock.Mock()))
        stack.enter_context(mock.patch('sys.argv', ['test']))
        stack.enter_context(mock.patch('socket.gethostname', mock.Mock(side_effect=Exception('hostname exception'))))
        mock_linf = stack.enter_context(mock.patch('logging.info', mock.Mock()))
        setup_logging(None, None, verbose=True)
        mock_fh.assert_not_called()
        mock_lbc.has_call(mock.call(format="%(asctime)s - %(levelname)-8s - %(message)s", level=logging.DEBUG))
        mock_linf.has_call(mock.call('hostname exception'))


@pytest.mark.unit
def test_loader_options():
    opts = loader_options('test', ['prop1', 'prop2'])

    def _options_test(prop1=None, prop2=None):
        return prop1 + prop2
    decorated_f = opts(_options_test)
    assert ['test_prop1', 'test_prop2'] == [o.name for o in decorated_f.__click_params__]
