import React, { useState } from "react";
import { styled } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faBars } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "styled-components";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const NavbarContainer = styled.nav`
  width: 100%;
  height: 100px;
  border-bottom: 2px solid ${({ theme }) => theme.toggleBorder};
  display: flex;
  padding: 0 5%;
  justify-content: space-between;
  div {
    display: flex;
    align-items: center;
  }
  .brand img {
    height: 50%;
  }
  .brand {
    gap: 10px;
  }
  h1 {
    color: ${({ theme }) => theme.primary};
    font-size: 1.8rem;
  }
  button {
    outline: none;
    border: 2px solid ${({ theme }) => theme.toggleBorder};
    background-color: ${({ theme }) => theme.background};
    transition: all 0.2s linear;
    width: fit-content;
    padding: 0 20px;
    height: 50px;
    align-self: center;
    border-radius: 1000px;
  }
  button:hover {
    box-shadow: 2px 4px ${({ theme }) => theme.toggleBorder};
  }
  .menu {
    position: relative;
  }
  .menu button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
  }

  .sub-active {
    box-shadow: 2px 4px ${({ theme }) => theme.toggleBorder};
  }

  .sub-menu {
    position: absolute;
    top: 89%;
    border: 2px solid ${({ theme }) => theme.toggleBorder};
    width: 250px;
    right: 5%;
    background-color: ${({ theme }) => theme.background};
    box-shadow: 4px 4px 20px ${({ theme }) => theme.toggleBorder};
    padding: 10px 0px;
    border-radius: 16px;
  }
  .sub-menu ul {
    display: flex;
    flex-direction: column;
    gap: 10px;
    font-size: 1.2rem;
    width: 100%;
  }
  .sub-menu ul li {
    padding: 2px;
  }
  .sub-menu ul li:hover {
    background-color: ${({ theme }) => theme.toggleBorder};
  }
  .sub-menu span {
    margin-left: 10px;
  }
`;

export default function Navigation() {
  const theme = useTheme();
  const [submenuActive, setSubmenuAvtice] = useState(false);
  return (
    <NavbarContainer>
      <div className='brand'>
        <img
          src='https://companieslogo.com/img/orig/ABNB-4aaade0f.png?t=1633511992'
          alt='airbnb logo'
        />
        <h1>airbnb</h1>
      </div>
      <div className='menu' onClick={() => setSubmenuAvtice(!submenuActive)}>
        <button className={`${submenuActive && "sub-active"}`}>
          <FontAwesomeIcon icon={faBars} color={theme.text} />
          <FontAwesomeIcon icon={faUserCircle} color={theme.text} />
        </button>
        {submenuActive && (
          <div className='sub-menu'>
            <ul>
              <Link>
                {" "}
                <li>
                  <span>Sign up</span>
                </li>
              </Link>
              <Link to='/login'>
                <li>
                  <span>Log in</span>
                </li>
              </Link>
              <Link>
                <li>
                  <span>Airbnb your home</span>
                </li>
              </Link>
              <Link>
                <li>
                  <span>Help</span>
                </li>
              </Link>
            </ul>
          </div>
        )}
      </div>
    </NavbarContainer>
  );
}
