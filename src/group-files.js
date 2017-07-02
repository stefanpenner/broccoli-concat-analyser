function createGroups(path, groups) {
  if (path.length === 0) {
    return groups;
  }

  let remainingPath = path.slice();
  let firstPathSegment = remainingPath.shift();

  let foundGroup = groups.find(group => group.label === firstPathSegment);
  if (foundGroup) {
    if (!foundGroup.groups) {
      foundGroup.groups = [];
    }
  } else {
    foundGroup = {
      label: firstPathSegment,
      groups: []
    };
    groups.push(foundGroup);
  }

  return createGroups(remainingPath, foundGroup.groups);
}

function groupFiles(files) {
  let pathHash = {};
  let groups = [];

  files.forEach((file) => {
    if (!file.relativePath) {
      throw new Error('file needs relativePath property');
    }
    let parts = file.relativePath.split('/');
    let label = parts.pop();
    let path = parts.join('/');

    let groupedFile = {
      sizes: file.sizes,
      label
    };
    let parent;

    if (pathHash[path]) {
      parent = pathHash[path];
    } else {
      parent = createGroups(parts, groups);
      pathHash[path] = parent;
    }

    parent.push(groupedFile);
  });

  return groups;
}

module.exports = groupFiles;