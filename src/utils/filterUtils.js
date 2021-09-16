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