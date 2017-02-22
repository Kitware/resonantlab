let namespaces = new Set();

const makeEnum = (ns, keys) => {
  // Construct an object containing keys matching those passed in `keys`, whose
  // values are the keys themselves, prefixed by the specified namespace.
  //
  // Dots are not allowed in the namespace name.
  if (ns.indexOf('.') > -1) {
    throw new Error('dots not allowed in namespace');
  }

  // Namespaces are not allowed to repeat.
  if (namespaces.has(ns)) {
    throw new Error(`duplicate namespace "${ns}"`);
  }
  namespaces.add(ns);

  let obj = {};

  let used = new Set();
  keys.forEach((key) => {
    if (key.indexOf('.') > -1) {
      throw new Error('dots not allowed in key');
    }

    if (used.has(key)) {
      throw new Error(`duplicate key "${key}"`);
    }
    used.add(key);

    obj[key] = `${ns}.${key}`;
  });

  // Freeze the resulting object so no one else can alter the values or keys.
  return Object.freeze(obj);
};

const enumName = (enumVal) => enumVal.split('.')[0];
const enumValue = (enumVal) => enumVal.split('.')[1];

export {
  makeEnum,
  enumName,
  enumValue
};
