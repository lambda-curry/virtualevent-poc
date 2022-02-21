export const TRACK_GROUP_CLASS_NAME = 'PresentationCategoryGroup';

export const calculateVotesPerTrackGroup = (presentations, votes) => {
  const votesPerTrackGroup = {};
  votes.forEach(v => {
    const presentation = presentations.find(p => p.id === v.presentation_id);
    if (presentation && presentation.track && presentation.track.track_groups) 
      presentation.track.track_groups.forEach(trackGroupId => {
        if (!votesPerTrackGroup[trackGroupId])
          votesPerTrackGroup[trackGroupId] = 0;
        votesPerTrackGroup[trackGroupId] += 1;
      });
  });
  return votesPerTrackGroup;
};

export const calculateRemaingVotes = (votingPeriod = {}, votesPerTrackGroup) => {
  const remainingVotes = {};
  Object.entries(votingPeriod).forEach(entry => {
    const [trackGroupId, votingPeriod] = entry;
    remainingVotes[trackGroupId] = votingPeriod.maxAttendeeVotes === 0 ? Infinity : votingPeriod.maxAttendeeVotes - (votesPerTrackGroup[trackGroupId] ?? 0);
  });
  return remainingVotes;
};
