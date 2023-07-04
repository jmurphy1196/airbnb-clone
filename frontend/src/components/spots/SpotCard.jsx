import { styled } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

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
  }
  .price {
    color: ${({ theme }) => theme.text};
    font-weight: bold;
  }
`;

export const SpotCard = ({ spot }) => {
  return (
    <>
      <SpotCardWrapper>
        <div className='preview'>
          <img
            src={`${spot.preview != null ? spot.preview : "./stock-house.png"}`}
            alt='preivew image of spot'
          />
        </div>
        <div className='details'>
          <header>
            <h4>
              {spot.city}, {spot.state}
            </h4>
            <span>
              {" "}
              <FontAwesomeIcon icon={faStar} width={15} /> {spot.avgRating}
            </span>
          </header>
          <span className='desc'>{spot.description}</span>
          {/* placeholder */}
          <span className='desc'>Jul 31 - Aug 5</span>
          <span>
            <span className='price'>${spot.price}</span> / night
          </span>
        </div>
      </SpotCardWrapper>
    </>
  );
};
