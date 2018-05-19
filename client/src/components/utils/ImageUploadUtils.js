import fetch from 'isomorphic-fetch'

const isEmpty = (value = '') => {
  switch (typeof value) {
    case 'object': {
      if (value === null) return true
      let count = 0
      for (const i in value) {
        if (i) count += 1
      }
      return count <= 0
    }
    case 'number': {
      return false
    }
    case 'function': {
      return true
    }
    case 'boolean': {
      if (value) return false
      return true
    }
    default:
      return value.length <= 0
  }
}

const removeFile = (link, uploadedFilename, onRemoveSuccess) => {
  return new Promise(function(resolve, reject) {
    if(!link || !uploadedFilename) {
      resolve(false);
    }
    else {
      let fullLink = link + '?filename=' + uploadedFilename;
      fetch(fullLink, {
        method: 'DELETE'
      })
      .then(response => {
        return response.json()
      })
      .then(response => {
        let output = { ...response, uploadedFilename };
        onRemoveSuccess(output);
        resolve(output);
      })
      .catch(function(err) {
        resolve(false);
      });
    }
  });
}

const uploadFile = (link, files, id, name, onUploadSuccess) => {
  return new Promise(function(resolve, reject) {
    let formData = new FormData() // eslint-disable-line
    formData.append('id', id);
    formData.append(name, files.file)

    fetch(link, {
      method: 'POST',
      body: formData
    })
    .then(response => {
      return response.json()
    })
    .then(response => {
      let output = { ...response, id };
      onUploadSuccess(output);
      resolve(output);
    })
    .catch(function(err) {
      resolve(false);
    })
  });
}

const getFileType = type => {
  if (/^image/.test(type)) {
    return 'image'
  } else {
    return type
  }
}

export { isEmpty, uploadFile, getFileType, removeFile }
