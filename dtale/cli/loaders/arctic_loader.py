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
from arctic import Arctic  # isort:skip

from builtins import map

import pandas as pd
from arctic.store.versioned_item import VersionedItem

from dtale.cli.clickutils import get_loader_options

'''
  IMPORTANT!!! This global variable is required for building any customized CLI loader.
  When find loaders on startup it will search for any modules containing the global variable LOADER_KEY.
'''
LOADER_KEY = 'arctic'
LOADER_PROPS = ['host', 'library', 'node', 'start', 'end']


# IMPORTANT!!! This function is required for building any customized CLI loader.
def find_loader(kwargs):
    """
    Arctic implementation of data loader which will return a function if any of the
    `click` options based on LOADER_KEY & LOADER_PROPS have been used, otherwise return None

    :param kwargs: Optional keyword arguments to be passed from `click`
    :return: data loader function for arctic implementation
    """
    arctic_opts = get_loader_options(LOADER_KEY, kwargs)
    if len([f for f in arctic_opts.values() if f]):
        def _arctic_loader():
            host = Arctic(arctic_opts['host'])
            lib = host.get_library(arctic_opts['library'])
            read_kwargs = {}
            start, end = map(arctic_opts.get, ['start', 'end'])
            if start and end:
                read_kwargs['chunk_range'] = pd.date_range(start, end)
            data = lib.read(arctic_opts['node'], **read_kwargs)
            if isinstance(data, VersionedItem):
                data = data.data
            return data

        return _arctic_loader
    return None
