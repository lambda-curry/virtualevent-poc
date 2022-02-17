export const syncFilters = (newFilters, currentFilters) => {
    // new filters are the source of truth
    Object.entries(newFilters).forEach(([key, value]) => {
        if(currentFilters.hasOwnProperty(key)) {
            // copy over values and options if they exists
            let filter = currentFilters[key];
            if(filter.hasOwnProperty("values"))
                value.values = filter.values;
            if(filter.hasOwnProperty("options"))
                value.options = filter.options;
        }
    });
    return newFilters;
}

export const filterByTrackGroup = (originalEvents, currentTrackGroupId = 0) => {
    if (currentTrackGroupId == 0) return originalEvents;
    return originalEvents.filter((ev) => {
        return ev?.track?.track_groups.includes(currentTrackGroupId);
    });
}