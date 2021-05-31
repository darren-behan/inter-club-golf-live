import React, { useContext } from 'react';
import './index.css';
import DataAreaContext from '../../utils/DataAreaContext';
import { Collapse } from 'react-bootstrap';

function Sidebar() {
  const { isActive } = useContext(DataAreaContext);
  
  return (
    <>
    <Collapse in={isActive}>
      <div id="filters-collapse">
        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus
        terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer
        labore wes anderson cred nesciunt sapiente ea proident.
      </div>
    </Collapse>
    </>
  );
}

export default Sidebar;