const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

export { MAPBOX_ACCESS_TOKEN };

export const reverseGeocode = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?` +
      new URLSearchParams({
        access_token: MAPBOX_ACCESS_TOKEN,
        types: 'address,place,locality,neighborhood,district,postcode,region'
      })
    );
    
    const data = await response.json();
    
    if (!data.features || data.features.length === 0) {
      throw new Error('No address found for this location');
    }
    
    const address = data.features[0].place_name;
    let city = '';
    let district = '';
    let province = '';
    let postal_code = '';
    
    data.features.forEach(feature => {
      if (feature.place_type.includes('place')) city = city || feature.text;
      if (feature.place_type.includes('district') || feature.place_type.includes('neighborhood')) {
        district = district || feature.text;
      }
      if (feature.place_type.includes('region')) province = province || feature.text;
      if (feature.place_type.includes('postcode')) postal_code = postal_code || feature.text;
    });
    
    return {
      longitude: lng,
      latitude: lat,
      address,
      city,
      district,
      province,
      postal_code
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return {
      longitude: lng,
      latitude: lat,
      address: `Location at ${lat.toFixed(6)}, ${lng.toFixed(6)}`
    };
  }
};