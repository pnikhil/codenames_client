import React from 'react';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'

const Users = ({users, me}) => {


	return (

		<div>
			<ul>
				{
					users.map((e,i) => {
					return(		
							<li key={i}>
							{e.name.charAt(0).toUpperCase() + e.name.slice(1) } 
							{e.name === me && <span>(you)</span>}
							{e.spymaster && <FontAwesomeIcon icon={faUserSecret} />}
							</li>
						) 
				})
				}
			</ul>
		</div>

		)
}

export default Users
