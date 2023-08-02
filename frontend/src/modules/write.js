import {createAction, handleActions} from 'redux-actions';
import createRequestSaga, {
    createRequestActionTypes,
} from '../lib/createRequestSaga';
import * as postsAPI from '../lib/api/posts';
import {takeLatest} from 'redux-saga/effects';


const INITALIZE = 'write/INITALIZE'; //모든 내용 초기화
const CHANGED_FIELD = 'write/CHANGED_FIELD'; //특정 key 값 바꾸리
const [
    WRITE_POST,
    WRITE_POST_SUCCESS,
    WRITE_POST_FAILURE,
] = createRequestActionTypes('write/WRITE_POST');

export const initalize = createAction(INITALIZE);
export const changeField = createAction(CHANGED_FIELD, ({key, value}) => ({
    key,
    value,    
}));
export const writePost = createAction(WRITE_POST, ({title,body,tags}) => ({
    title,
    body,
    tags,
}));

//사가 생성
const writePostSaga = createRequestSaga(WRITE_POST, postsAPI.writePost);
export function* writeSaga() {
    yield takeLatest(WRITE_POST, writePostSaga);
}

const initialState = {
    title: '',
    body: '',
    tags: [],
    post: null,
    postError: null,
};

const write = handleActions(
    {
        [INITALIZE]: state => initialState, //initalState를 넣으면 초기 상태로 바뀜
        [CHANGED_FIELD]: (state, {payload:{key, value}}) => ({
            ...state,
            [key]: value, //특정 key 값을 업데이트
        }),
        [WRITE_POST]: state => ({
            //post와 postError를 초기화
            post: null,
            postError: null,
        }),
        //포스트 작성 성공
        [WRITE_POST_SUCCESS]: (state, {payload:post}) => ({
            ...state,
            post,
        }),
        //포스트 작성 실패
        [WRITE_POST_FAILURE]: (state, {payload:postError}) => ({
            ...state,
            postError,
        })
    },
    initialState,
);

export default write;