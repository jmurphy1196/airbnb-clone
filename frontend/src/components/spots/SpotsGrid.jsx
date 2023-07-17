import { useState, useEffect, useRef } from "react";
import { SpotCard } from "./SpotCard";
import { SpotsWrapper } from "./SpotsWrapper";
import { useSelector, useDispatch } from "react-redux";
import { thunkGetSpots } from "../../store/spots";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

export const SpotsGrid = () => {
  const orderedSpots = useSelector((state) => state.spots.orderedSpots);
  const [bottom, setBottom] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const size = queryParams.get("size");
  const currentPage = useRef(1);

  const handleScroll = async () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollPosition =
      window.scrollY ||
      window.pageYOffset ||
      document.body.scrollTop + (document.documentElement.scrollTop || 0);

    if (
      scrollPosition + windowHeight >= documentHeight ||
      windowHeight >= documentHeight
    ) {
      const pagination = {
        size: size !== undefined ? size : 10,
        page: currentPage.current + 1,
      };
      await dispatch(thunkGetSpots(pagination));
      currentPage.current += 1;
      setBottom(true);
    } else {
      setBottom(false);
    }
  };

  useEffect(() => {
    (async () => {
      const pagination = {
        size: size !== undefined ? size : 10,
        page: currentPage.current,
      };
      await dispatch(thunkGetSpots(pagination));
    })();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
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
