// updateData
import { showAlert } from './alert';
import axios from 'axios';

// type is either password or data
export const updateSettings = async (data, type) => {
  try {
    const urlType = type === 'password' ? 'updateMyPassword' : 'updateMe';
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/${urlType}`,
      data
    });
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} Successfully Updated`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
