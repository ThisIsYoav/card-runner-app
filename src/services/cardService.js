import http from "./httpService";
import { apiUrl } from "../config.json";

export function getTopCards(cancelToken) {
  return http.get(`${apiUrl}/cards/top`, {cancelToken});
}

export function searchCards(query, cancelToken) {
  return http.get(`${apiUrl}/cards/search${query}`, {cancelToken});
}

export function getCard(cardId, cancelToken) {
  return http.get(`${apiUrl}/cards/${cardId}`, {cancelToken});
}

export function editCard(card) {
  const cardId = card._id;
  delete card._id;
  return http.put(`${apiUrl}/cards/${cardId}`, card);
}

export function deleteCard(cardId) {
  return http.delete(`${apiUrl}/cards/${cardId}`, cardId);
}

export function toggleFav({cardId}, cancelToken) {
  return http.patch(`${apiUrl}/cards/my-favorites`, {cardId}, {cancelToken});
}

export function getMyFavs(cancelToken) {
    return http.get(`${apiUrl}/cards/my-favorites`, {cancelToken});
}

export function getMyCards(cancelToken) {
  return http.get(`${apiUrl}/cards/my-cards`, {cancelToken});
}

export function createCard(card) {
  return http.post(`${apiUrl}/cards`, card);
}

export default {
  createCard,
  searchCards,
  toggleFav,
  getMyFavs,
  getMyCards,
  getCard,
  editCard,
  deleteCard,
  getTopCards
};
