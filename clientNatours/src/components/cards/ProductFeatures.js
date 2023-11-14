import { IoBedOutline } from "react-icons/io5";
import { TbBath } from "react-icons/tb";
import { BiArea } from "react-icons/bi";

export default function ProductFeatures ({p}) {
  return (
    <p className="card-text d-flex justify-content-between">
              {p?.bedrooms ? (
                <span>
                  <IoBedOutline /> {p?.bedrooms}
                </span>
              ) : ''}
              {p?.bathrooms ? (
                <span>
                  <TbBath /> {p?.bathrooms}
                </span>
              ) : ''}
              {p?.landsize ? (
                <span>
                  <BiArea /> {p?.landsize}
                </span>
              ) : ''}
            </p>
  );
}