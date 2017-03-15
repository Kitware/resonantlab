import { select } from 'd3-selection';

import { restRequest } from 'girder/rest';

import { store } from '~reslab/redux';

const initializeOverlays = (selector, overlays) => {
  // This function creates elements to hold each "overlay" in the application.
  // The `overlays` arguments holds an array of arrays, each of which serves as
  // a specification for how to construct an overlay. Each spec contains 2
  // required and 1 optional item:
  //
  // spec[0] is the name of the overlay, formatted as a CSS class name (i.e., in
  // dash-case).
  //
  // spec[1] is a function that takes a CSS selector or a raw element to house
  // the overlay, and instantiates it inside that element.
  //
  // spec[2] is an optional object to use as the "this" context for the
  // initializer function given in spec[1].
  overlays.forEach(spec =>
    spec[1].bind(spec[2])(
      selector.append('div')
        .classed('overlay', true)
        .classed(spec[0], true)
        .node())
  );
};

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
    return {
      login: null,
      private: null,
      public: null
    };
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
    visibility: item.folderId === state.getIn(['user', 'public']) ? 'public' : 'private',
    dataset: item.meta && item.meta.dataset || null,
    vis: item.meta && item.meta.vis || null,
    matchings: item.meta && item.meta.matchings || {}
  };
};

const gatherDatasetInfo = (item) => {
  return {
    name: item.name
  };
};

const setItemMetadata = (itemId, metadata) => restRequest({
  type: 'PUT',
  path: `/item/${itemId}/metadata?allowNull=true`,
  data: JSON.stringify(metadata),
  contentType: 'application/json'
});

const initializeNewProject = () => {
  const folder = projectFolder();

  return restRequest({
    type: 'POST',
    path: '/item',
    data: {
      folderId: folder,
      name: 'Untitled Project'
    }
  }).then(item => setItemMetadata(item._id, {
    dataset: null,
    itemType: 'project',
    matchings: null,
    vis: null
  })).then(gatherProjectInfo);
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
  initializeOverlays,
  switchOverlay,
  gatherProjectInfo,
  gatherDatasetInfo,
  setItemMetadata,
  initializeNewProject,
  userInformation,
  currentUser,
  updateProjectName,
  getProjects
};
