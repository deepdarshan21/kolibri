/* eslint-disable prefer-arrow-callback */
const { ChannelResource, FileSummaryResource } = require('kolibri').resources;

const namespace = 'MANAGE_CONTENT';

const actionTypes = {
  ADD_CHANNEL_FILE_SUMMARY: `${namespace}_ADD_CHANNEL_FILE_SUMMARY`,
};

/**
 * Force-refresh the ChannelResource Collection
 *
 * @param {Object} store - vuex store object
 */
function refreshChannelList(store) {
  return ChannelResource.getCollection().fetch({}, true);
}

/**
 * Delete a Channel from the device
 *
 * @param {Object} store - vuex store object
 * @param {string} channelId - a valid channel UUID
 * @returns {Promise}
 */
function deleteChannel(store, channelId) {
  return ChannelResource.getModel(channelId).delete()
  .then(refreshChannelList);
}

/**
 * Request and hydrate pageState with file summary info for single channel
 *
 * @param {Object} store - vuex store object
 * @param {string} channelId - channel UUID
 * @returns {Promise}
 */
function addChannelFileSummary(store, channelId) {
  return FileSummaryResource.getCollection({ channel_id: channelId }).fetch()
  // FileSummary response is wrapped in an array as workaround on server side
  .then(function onSuccess([data]) {
    store.dispatch(actionTypes.ADD_CHANNEL_FILE_SUMMARY, data);
  })
  .catch(function onFailure(err) {
    console.error(err); // eslint-disable-line
  });
}

/**
 * Hydrate the manage content pageState with file summary info for all channels.
 * Requests for individual channels are non-blocking.
 *
 * @param {Object} store - vuex store object
 * @param {Array<String>} channelIds - an array of channelIds
 * @return {undefined}
 */
function addChannelFileSummaries(store, channelIds) {
  channelIds.forEach((channelId) => {
    addChannelFileSummary(store, channelId);
  });
}

module.exports = {
  actionTypes,
  addChannelFileSummaries,
  deleteChannel,
  refreshChannelList,
};