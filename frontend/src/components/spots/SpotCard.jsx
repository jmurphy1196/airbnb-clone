import { styled } from "styled-components";
import { useRef, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "react-tooltip";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { device } from "../../theme";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const SpotCardWrapper = styled.div`
  display: flex;
  border-radius: 16px;
  flex-direction: column;
  cursor: pointer;
  .preview {
    width: 100%;
    object-fit: cover;
  }
  .preview img {
    width: 100%;
    border-radius: 15px;
    height: 300px;
    border: 1px solid ${({ theme }) => theme.toggleBorder};
    @media ${device.mobile} {
      height: 300px;
    }
    @media ${device.tablet} {
    }
    @media ${device.laptop} {
      height: 250px;
    }
    @media ${device.desktop} {
      height: 300px;
    }
  }
  .details {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .details header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-transform: capitalize;
  }
  span.desc {
    color: ${({ theme }) => theme.light};
    display: inline-block;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .price {
    color: ${({ theme }) => theme.text};
    font-weight: bold;
  }
  .buttons {
    display: flex;
    gap: 10px;
  }
  .buttons button {
    background-color: ${({ theme }) => theme.light};
    color: white;
    padding: 10px;
    width: 100px;
  }
`;

export const SpotCard = ({ spot, isEdit, setIsOpen, setActiveSpotId }) => {
  const cardRef = useRef(null);
  const history = useHistory();
  const [isInView, setIsInView] = useState(true);
  const handleDelete = () => {
    setActiveSpotId(spot.id);
    setIsOpen(true);
  };
  const handleEdit = () => {
    history.push(`/spots/${spot.id}/edit`);
  };
  useEffect(() => {
    const card = cardRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) setIsInView(false);
        });
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.3,
      }
    );

    if (card) {
      observer.observe(card);
    }

    return () => {
      if (card) {
        observer.unobserve(card);
      }
    };
  }, []);

  useEffect(() => {
    const card = cardRef.current;
    if (!isInView) {
      gsap.set(card, { opacity: 0 });

      ScrollTrigger.create({
        trigger: card,
        start: "top bottom",
        once: true,
        onEnter: () =>
          gsap.to(card, { opacity: 1, duration: 0.8, ease: "power2.inOut" }),
      });
    }
  }, [isInView]);

  return (
    <SpotCardWrapper
      data-tooltip-id={spot.id}
      data-tooltip-content={spot.name}
      data-tooltip-place='top-start'
      ref={cardRef}
    >
      <Link to={`/spots/${spot.id}`}>
        <div className='preview'>
          <img
            src={`${spot.preview != null ? spot.preview : "/stock-house.png"}`}
            alt='preivew image of spot'
          />
        </div>
      </Link>
      <div className='details'>
        <header>
          <h4>
            {spot.city}, {spot.state}
          </h4>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {" "}
            <FontAwesomeIcon icon={faStar} width={15} color='gold' />{" "}
            {Number(spot.avgRating).toFixed(1) != 0.0
              ? Number(spot.avgRating).toFixed(1)
              : "New"}
          </span>
        </header>
        <span className='desc'>{spot.description}</span>
        {/* placeholder */}
        <span className='desc'>Jul 31 - Aug 5</span>
        <span>
          <span className='price'>${Number(spot.price).toFixed(2)}</span> /
          night
        </span>
        <Tooltip id={spot.id} />
        {isEdit && (
          <div className='buttons'>
            <button onClick={handleDelete}>Delete</button>
            <button onClick={handleEdit}>Update</button>
          </div>
        )}
      </div>
    </SpotCardWrapper>
  );
};
