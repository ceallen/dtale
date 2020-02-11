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
import unittest as ut

import numpy as np
import pandas as pd
import pytest
from six import PY3


@pytest.fixture(scope="module")
def unittest():
    tc = ut.TestCase('__init__')
    tc.longMessage = True
    return tc


@pytest.fixture(scope="module")
def test_data():
    now = pd.Timestamp('20000101')
    return pd.DataFrame(
        [dict(date=now, security_id=i, foo=1, bar=1.5, baz='baz') for i in range(50)],
        columns=['date', 'security_id', 'foo', 'bar', 'baz']
    )


@pytest.fixture(scope="module")
def rolling_data():
    # https://github.com/man-group/dtale/issues/43
    ii = pd.date_range(start='2018-01-01', end='2019-12-01', freq='D')
    ii = pd.Index(ii, name='date')
    n = ii.shape[0]
    c = 5
    data = np.random.random((n, c))
    return pd.DataFrame(data, index=ii)


@pytest.fixture(scope="module")
def builtin_pkg():
    if PY3:
        return 'builtins'
    return '__builtin__'
