import { useState } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import CurrencyInput from 'react-currency-input-field';
import { GOOGLE_PLACES_KEY } from "../../config";

export default function AdForm({ action, type }) {
  // state
  const [ad, setAd] = useState({
    photos: [],
    uploading: false,
    price: "",
    address: "",
    bedrooms: "",
    bathrooms: "",
    carpark: "",
    landsize: "",
    type: "",
    title: "",
    description: "",
    loading: false,
  });

  return (
    <>
      <div className="mb-3 form-control">
        <GooglePlacesAutocomplete
          apiKey={GOOGLE_PLACES_KEY}
          apiOptions="kr"
          selectProps={{
            defaultInputValue: ad?.address,
            placeholder: "Search for address..",
            onChange: ({ value }) => {
              setAd({ ...ad, address: value.description });
            },
          }}
        />
      </div>

      <CurrencyInput
          className='form-control mb-3'
          placeholder="Enter price"
          defaultValue={ad.price}
          onValueChange={(value) => setAd({...ad, price: value})}
        />;
      <pre>{JSON.stringify(ad, null, 4)}</pre>

    </>
  )
}

