import axios from "axios";
const ENDPOINT_URL = "https://kdt-api.fe.dev-cos.com/documents";

// 공통 Headers
const headers = {
  "Content-Type": "application/json",
  "x-username": "WT", // 고유한 이름 입력
};

// API 유틸리티 함수
const api = {
  // Root Documents 가져오기
  async getRootDocuments() {
    try {
      const response = await axios.get(ENDPOINT_URL, {
        // 요청 헤더
        headers,
      });
      console.log(response.data); // Axios response.data로 응답 데이터에 접근
      return response.data;
    } catch (error) {
      console.error("Error fetching root documents:", error.message);
      throw error; // 호출한 쪽에서 에러 처리하도록 재던짐
    }
  },

  // 특정 Document content 조회
  async getDocument(id) {
    try {
      const response = await axios.get(`${ENDPOINT_URL}/${id}`, {
        headers,
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching document ${id}:`, error.message);
      throw error;
    }
  },

  // Document 생성
  async createDocument(title, parent = null) {
    try {
      const body = {
        title,
        parent,
      }; // 생성할 데이터
      const response = await axios.post(ENDPOINT_URL, body, {
        headers,
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating document:", error.message);
      throw error;
    }
  },

  // Document 수정
  async updateDocument(id, title, content) {
    try {
      const body = {
        title,
        content,
      }; // 수정할 데이터
      const response = await axios.put(`${ENDPOINT_URL}/${id}`, body, {
        headers,
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating document ${id}:`, error.message);
      throw error;
    }
  },

  // Document 삭제
  async deleteDocument(id) {
    try {
      const response = await axios.delete(`${ENDPOINT_URL}/${id}`, {
        headers,
      });
      console.log(`Document ${id} deleted`);
    } catch (error) {
      console.error(`Error deleting document ${id}:`, error.message);
      throw error;
    }
  },
};

export default api;
