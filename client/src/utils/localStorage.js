export const getSavedSearchIds = () => {
  const savedSearchIds = localStorage.getItem('saved_searches')
    ? JSON.parse(localStorage.getItem('saved_searches'))
    : [];

  return savedSearchIds;
};

export const saveSearchIds = (searchIdArr) => {
  if (searchIdArr.length) {
    localStorage.setItem('saved_searches', JSON.stringify(searchIdArr));
  } else {
    localStorage.removeItem('saved_searches');
  }
};

export const removeSearchId = (searchId) => {
  const savedSearchIds = localStorage.getItem('saved_searches')
    ? JSON.parse(localStorage.getItem('saved_searches'))
    : null;

  if (!savedSearchIds) {
    return false;
  }

  const updatedSavedSearchIds = savedSearchIds?.filter((savedSearchId) => savedSearchId !== searchId);
  localStorage.setItem('saved_searches', JSON.stringify(updatedSavedSearchIds));

  return true;
};
