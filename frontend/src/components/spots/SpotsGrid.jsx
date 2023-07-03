import { SpotCard } from "./SpotCard";
import { SpotsWrapper } from "./SpotsWrapper";
import { useSelector } from "react-redux";

export const SpotsGrid = () => {
  const orderedSpots = useSelector((state) => state.spots.orderedSpots);
  return (
    <>
      <SpotsWrapper>
        {orderedSpots.map((spot) => {
          return <SpotCard spot={spot} />;
        })}
      </SpotsWrapper>
    </>
  );
};
