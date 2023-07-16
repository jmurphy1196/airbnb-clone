import { useEffect } from "react";
import { SpotCard } from "./SpotCard";
import { SpotsWrapper } from "./SpotsWrapper";
import { useSelector, useDispatch } from "react-redux";
import { thunkGetSpots } from "../../store/spots";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

export const SpotsGrid = () => {
  const orderedSpots = useSelector((state) => state.spots.orderedSpots);
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const size = queryParams.get("size");
  const page = queryParams.get("page");
  console.log("this is the size", size);
  useEffect(() => {
    (async () => {
      const pagination = {
        size: size !== undefined ? size : 10,
        page: page !== undefined ? page : 1,
      };
      await dispatch(thunkGetSpots(pagination));
    })();
  }, []);
  return (
    <>
      <SpotsWrapper>
        {orderedSpots.map((spot) => {
          return <SpotCard key={spot.id} spot={spot} />;
        })}
      </SpotsWrapper>
    </>
  );
};
