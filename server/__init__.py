"""Entry point for serverside portion of Resonant Lab plugin."""

import os

import yaml

from girder.api import access
from girder.api.describe import Description, describeRoute
from girder.api.rest import Resource
from girder.utility.plugin_utilities import registerPluginWebroot


class ResonantLab(Resource):
    """Girder resource definition for Resonant Lab."""

    _cp_config = {'tools.staticdir.on': True,
                  'tools.staticdir.index': 'index.html'}

    def __init__(self, version=None, sha=None):
        """Initialize."""
        super(ResonantLab, self).__init__()

        self.version = version
        self.sha = sha

        self.resourceName = 'resonantlab'

        self.route('GET', ('build', 'version'), self.get_version)
        self.route('GET', ('build', 'hash'), self.get_hash)

    @access.public
    @describeRoute(
        Description('''Get Resonant Lab's current version number.''')
    )
    def get_version(self, params):
        """Return Resonant Lab version number."""
        return self.version

    @access.public
    @describeRoute(
        Description('''Get Resonant Lab's build hash.''')
    )
    def get_hash(self, params):
        """Return Resonant Lab git build hash."""
        return self.sha


def load(info):
    """Girder plugin loading hook for Resonant Lab."""
    # Compute full path to plugin's index.html file.
    ResonantLab._cp_config['tools.staticdir.dir'] = os.path.join(info['pluginRootDir'], 'web_external')

    # Read the version number from the plugin specification file.
    config_file = os.path.join(info['pluginRootDir'], 'plugin.yml')
    with open(config_file) as f:
        config = yaml.safe_load(f)

    # Read the git hash from the hash file.
    git_sha_file = os.path.join(info['pluginRootDir'], 'git-sha')
    with open(git_sha_file) as f:
        git_sha = f.read().strip()

    # Instantiate ResonantLab resource and register the plugin with Girder.
    app = info['apiRoot'].resonantlab = ResonantLab(version=config.get('version'), sha=git_sha)
    registerPluginWebroot(app, info['name'])
