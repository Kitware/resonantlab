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

const initializeNewProject = () => {
  console.log('stub function: initializeNewProject');
  return Promise.resolve({
    name: 'Foobarius'
  });
};

export {
  switchOverlay,
  initializeNewProject,
  userInformation,
  currentUser
};
