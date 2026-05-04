import ReactDOM from 'react-dom';
import './HamburgerButton.css';

const HamburgerButton = props => {
  const content = (
    <>
      {props.show && <div className="backdrop" onClick={props.onClick}></div>}
      
      <aside className={`side-slider ${props.show ? 'open' : ''}`}>
        <nav className="side-slider__nav" onClick={props.onClick}>
          {props.children}
        </nav>
      </aside>
    </>
  );

  return ReactDOM.createPortal(content, document.getElementById('drawer-hook'));
};

export default HamburgerButton;