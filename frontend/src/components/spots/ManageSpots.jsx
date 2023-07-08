import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { thunkGetUserSpots } from "../../store/spots";
import { SpotsWrapper } from "./SpotsWrapper";
import { SpotCard } from "./SpotCard";
import DeleteSpotModal from "./SpotDeleteModal";

export default function ManageSpots() {
  const dispatch = useDispatch();
  const userSpots = useSelector((state) => state.spots.orderedUserSpots);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSpotId, setActiveSpotId] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await dispatch(thunkGetUserSpots());
    })();
  }, [dispatch]);
  return (
    <SpotsWrapper>
      {userSpots.map((spot) => {
        return (
          <SpotCard
            key={spot.id}
            spot={spot}
            isEdit
            setActiveSpotId={setActiveSpotId}
            setIsOpen={setIsOpen}
          />
        );
      })}
      <DeleteSpotModal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        spotId={activeSpotId}
      />
    </SpotsWrapper>
  );
}
