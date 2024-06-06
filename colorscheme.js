export let wholesaler_color_scheme = {
    primary: "#69372A",
    secondary: "#FBF5F4",
    accent: "#4D221F"
}

export let retailer_color_scheme = {
    primary: "#2C656C",
    secondary: "#F4FAFB",
    accent: "#21503A"
}

export let dispatch_color_scheme = {
    primary: "#296538",
    secondary: "#F4FBF6",
    accent: "#2C481E"
}

export let color_scheme = {
    primary: "#270140",
    secondary: "#F7F4FB",
    accent: "#270140",
    lightpurple:"#e5ddea",
    grey:'#B0B0B0',
}

export default function generateColorScheme(station_type) {
    if (station_type.toLowerCase() == "wholesaler") {
        return wholesaler_color_scheme
    } else if (station_type.toLowerCase() == "retailer") {
        return retailer_color_scheme
    } else {
        return dispatch_color_scheme
    }


}


