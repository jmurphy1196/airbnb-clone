import React, { useState, useRef, useEffect } from "react";
import { styled } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faBars } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "styled-components";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import LoginModal from "./session/LoginModal";

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
    height: 50px;
  }
  .brand {
    gap: 10px;
  }
  .brand a {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  h1 {
    color: ${({ theme }) => theme.primary};
    font-size: 1.8rem;
  }
  button.menu-btn {
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
  button.menu-btn:hover {
    box-shadow: 2px 4px 5px ${({ theme }) => theme.toggleBorder};
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
    box-shadow: 2px 4px 5px ${({ theme }) => theme.toggleBorder};
  }

  .sub-menu {
    position: absolute;
    top: 89%;
    border: 2px solid ${({ theme }) => theme.toggleBorder};
    width: 250px;
    right: 1px;
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
  .sub-menu button {
    text-align: start;
    background-color: ${({ theme }) => theme.background};
    font-size: inherit;
  }
  .sub-menu button:hover {
    background-color: ${({ theme }) => theme.background};
  }
  .sub-menu button li {
    width: 100%;
  }
`;

export default function Navigation() {
  const theme = useTheme();
  const [submenuActive, setSubmenuActive] = useState(false);
  const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
  const btnRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        btnRef.current &&
        !btnRef.current.contains(event.target) &&
        !loginModalIsOpen
      ) {
        if (submenuActive) setSubmenuActive(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [btnRef, submenuActive, setSubmenuActive, loginModalIsOpen]);
  return (
    <NavbarContainer>
      <div className='brand'>
        <Link to='/'>
          <img
            src='https://companieslogo.com/img/orig/ABNB-4aaade0f.png?t=1633511992'
            alt='airbnb logo'
          />
          <h1>airbnb</h1>
        </Link>
      </div>
      <div
        className='menu'
        onClick={() => setSubmenuActive(!submenuActive)}
        ref={btnRef}
      >
        <button className={`menu-btn ${submenuActive && "sub-active"}`}>
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
              <button onClick={() => setLoginModalIsOpen(true)}>
                <li>
                  <span>Log in</span>
                </li>
              </button>
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
      <LoginModal
        isOpen={loginModalIsOpen}
        onRequestClose={() => setLoginModalIsOpen(false)}
      />
    </NavbarContainer>
  );
}
