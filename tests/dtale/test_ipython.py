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
from collections import namedtuple

import mock
import pandas as pd
import pytest
from six import PY3

if PY3:
    from contextlib import ExitStack
else:
    from contextlib2 import ExitStack


# this test will make sure that ipython hasn't changed their implementations of display, IFrame & DisplayHandle.update
@pytest.mark.unit
def test_show(unittest):
    from dtale.app import show
    import dtale.views as views

    test_data = pd.DataFrame([dict(a=1, b=2)])
    with ExitStack() as stack:
        stack.enter_context(mock.patch('dtale.app.DtaleFlask.run', mock.Mock()))
        stack.enter_context(mock.patch('dtale.app.find_free_port', mock.Mock(return_value=9999)))
        stack.enter_context(mock.patch('socket.gethostname', mock.Mock(return_value='localhost')))
        stack.enter_context(mock.patch('dtale.app.logger', mock.Mock()))
        stack.enter_context(mock.patch('dtale.views.in_ipython_frontend', mock.Mock(return_value=True)))

        get_calls = {'ct': 0}
        getter = namedtuple('get', 'ok')

        def mock_requests_get(url, verify=True):
            if url.endswith('/health'):
                is_ok = get_calls['ct'] > 0
                get_calls['ct'] += 1
                return getter(is_ok)
            return getter(True)
        stack.enter_context(mock.patch('requests.get', mock_requests_get))
        instance = show(data=test_data, subprocess=False, name='foo')
        assert instance.__repr__() == ''
        assert instance.__str__() == ''
        instance.adjust_cell_dimensions(height=600)

    # cleanup
    views.DATA = {}
    views.DTYPES = {}
    views.SETTINGS = {}
    views.METADATA = {}
