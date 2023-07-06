import { useEffect } from "react";
import { SpotCard } from "./SpotCard";
import { SpotsWrapper } from "./SpotsWrapper";
import { useSelector, useDispatch } from "react-redux";
import { thunkGetSpots } from "../../store/spots";

export const SpotsGrid = () => {
  const orderedSpots = useSelector((state) => state.spots.orderedSpots);
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      await dispatch(thunkGetSpots());
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
