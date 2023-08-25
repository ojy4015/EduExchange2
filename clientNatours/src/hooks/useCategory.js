import { useState, useEffect } from 'react';
import axios from 'axios';

// hooks(return state values)
export default function useCategory() {
  const [categories, setCategories] = useState([]); // categories

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data } = await axios.get("/categorys");
      setCategories(data);
      //console.log("inside loadCategories: ", data);
    } catch (err) {
      console.log(err);
    }
  }

  //return { categories }; // return object
  return categories; //return array
}