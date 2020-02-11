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
import pandas as pd

LOADER_KEY = 'testcli'
LOADER_PROPS = []


def find_loader(kwargs):

    if kwargs.get(LOADER_KEY, False):
        def _testcli():
            return pd.DataFrame([dict(security_id=1, foo=1.5)])

        return _testcli
    return None
