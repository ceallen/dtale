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
#!/usr/bin/env python
from __future__ import print_function

import logging
import sys

import six
from setuptools import find_packages, setup
from setuptools.command.test import test as TestCommand

# Convert Markdown to RST for PyPI
# http://stackoverflow.com/a/26737672
try:
    import pypandoc
    long_description = pypandoc.convert('README.md', 'rst')
    changelog = pypandoc.convert('CHANGES.md', 'rst')
except (IOError, ImportError, OSError):
    long_description = open('README.md').read()
    changelog = open('CHANGES.md').read()


class PyTest(TestCommand):
    user_options = [('pytest-args=', 'a', "Arguments to pass to py.test")]

    def initialize_options(self):
        TestCommand.initialize_options(self)
        self.pytest_args = []

    def finalize_options(self):
        TestCommand.finalize_options(self)
        self.test_args = []
        self.test_suite = True

    def run_tests(self):
        logging.basicConfig(format='%(asctime)s %(levelname)s %(name)s %(message)s', level='DEBUG')

        # import here, cause outside the eggs aren't loaded
        import pytest

        args = [self.pytest_args] if isinstance(self.pytest_args, six.string_types) else list(self.pytest_args)
        args.extend(['--cov', 'dtale',
                     '--cov-report', 'xml',
                     '--cov-report', 'html',
                     '--junitxml', 'junit.xml',
                     '-v'
                     ])
        errno = pytest.main(args)
        sys.exit(errno)


setup(
    name="dtale",
    version="1.6.10",
    author="MAN Alpha Technology",
    author_email="ManAlphaTech@man.com",
    description="Web Client for Visualizing Pandas Objects",
    license="LGPL",
    long_description='\n'.join((long_description, changelog)),
    keywords=["numeric", "pandas", "visualization", "flask"],
    url="https://github.com/man-group/dtale",
    install_requires=[
        "lz4<=2.2.1; python_version < '3.0'",
        "lz4; python_version > '3.0'",
        "arctic",
        "Flask",
        "Flask-Compress",
        "future",
        "itsdangerous",
        "pandas",
        "requests",
        "scipy",
        "six"
    ],
    extras_require={
        'flasgger': ["jsonschema<3.0.0", "flasgger==0.9.3"]
    },
    tests_require=[
        "ipython",
        "mock",
        "pytest==4.6.4",
        "pytest-cov",
    ],
    classifiers=[
        "Development Status :: 4 - Beta",
        "License :: OSI Approved :: GNU Library or Lesser General Public License (LGPL)",
        "Operating System :: OS Independent",
        "Intended Audience :: Science/Research",
        "Programming Language :: Python",
        "Topic :: Scientific/Engineering",
        "Programming Language :: Python :: 2.7",
        "Programming Language :: Python :: 3.6",
    ],
    cmdclass={
        "test": PyTest,
    },
    packages=find_packages(exclude=["tests*", "script*"]),
    package_data={"dtale": ["static/dist/*",
                            "static/css/*",
                            "static/fonts/*",
                            "static/images/*",
                            "swagger/**/*",
                            "swagger/**/**/*",
                            "templates/**/*",
                            "templates/**/**/*"]},
    entry_points={"console_scripts": ["dtale = dtale.cli.script:main"]},
    zip_safe=False
)
