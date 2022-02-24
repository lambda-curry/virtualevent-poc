export const mapVotesPerTrackGroup = (votes, presentations) => {
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