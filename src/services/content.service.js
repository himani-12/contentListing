/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";
import * as APIS from '../constants/apis.js'

class ContentService {

  getDataList(pageNo) {

    return axios.get(`${APIS.BASE_URL}/data/page${pageNo}.json`)
      .then(response => response.data.page );
  }
}

export default new ContentService();
