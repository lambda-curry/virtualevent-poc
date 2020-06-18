import { navigate } from "gatsby"
import { connect } from 'react-redux'

const IndexPage = ({location, isLoggedUser}) => {
  if (location.pathname === `/` && !isLoggedUser) {
    navigate("/a/login");
    return null
  } else if (isLoggedUser) {
    navigate('/a/')
    return null
  }
}

const mapStateToProps = ({ loggedUserState }) => ({
  isLoggedUser: loggedUserState.isLoggedUser,  
})

export default connect(mapStateToProps)(IndexPage)