import PropTypes from 'prop-types'

const Notification = ({ message, notificationStatus }) => {
	return message ? <div className={'notification ' + notificationStatus}>{message}</div> : null
}

PropTypes.propTypes = {
	message: PropTypes.string.isRequired,
	notificationStatus: PropTypes.string.isRequired
}

export default Notification
