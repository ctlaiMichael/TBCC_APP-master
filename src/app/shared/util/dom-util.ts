export const DomUtil = {
    isInitialPage: () => {
        const frameZones = Array.from(document.body.classList);
        frameZones.forEach((item) => {
            if (item === 'initial_page') {
                return true;
            }
        });
        return false;
    }
};
