import { select } from 'd3-selection';

import { restRequest } from 'girder/rest';

import { store } from '~reslab/redux/store';

const switchOverlay = (which) => {
  select('#overlay')
    .style('display', which === null ? 'none' : null)
    .selectAll('.overlay')
    .style('display', function () {
      return select(this).classed(which) ? null : 'none';
    });
};

const userInformation = (user) => {
  if (user) {
    // A user is logged in; find their public/private folders.
    return restRequest({
      type: 'GET',
      path: '/folder',
      data: {
        parentType: 'user',
        parentId: user._id
      }
    }).then(folders => {
      let info = {
        login: user.login
      };

      folders.forEach(folder => {
        switch (folder.name) {
          case 'Private':
            info.private = folder._id;
            break;

          case 'Public':
            info.public = folder._id;
            break;
        }
      });

      return info;
    });
  } else {
    return Promise.resolve({
      login: null,
      private: null,
      public: null
    });
  }
};

const currentUser = () => store.getState().getIn(['user', 'login']);

const projectFolder = () => {
  const state = store.getState();
  return state.getIn(['user', 'public']) || state.getIn(['libPaths', 'publicScratchSpace']);
};

const gatherProjectInfo = (item) => {
  const state = store.getState();

  return {
    name: item.name,
    id: item._id,
    visibility: item.folderId === state.getIn(['user', 'public']) ? 'public' : 'private'
  };
};

const initializeNewProject = () => {
  const folder = projectFolder();

  return restRequest({
    type: 'POST',
    path: '/item',
    data: {
      folderId: folder,
      name: 'Untitled Project'
    }
  }).then(item => {
    return restRequest({
      type: 'PUT',
      path: `/item/${item._id}/metadata`,
      data: JSON.stringify({
        datasets: [],
        itemType: 'project',
        matchings: [],
        preferredWidgets: [],
        visualizations: []
      }),
      contentType: 'application/json'
    });
  }).then(gatherProjectInfo);
};

const updateProjectName = (projectId, name) => {
  return restRequest({
    type: 'PUT',
    path: `/item/${projectId}`,
    data: {
      name
    }
  });
};

const getProjects = (folderId) => {
  if (folderId === null) {
    return Promise.resolve([]);
  }

  return restRequest({
    type: 'GET',
    path: '/item',
    data: {
      folderId
    }
  }).then(items => items.filter(item => {
    return item.meta && item.meta.itemType === 'project';
  }));
};

export {
  switchOverlay,
  gatherProjectInfo,
  initializeNewProject,
  userInformation,
  currentUser,
  updateProjectName,
  getProjects
};
