import Mock from "mockjs"

Mock.mock("/mock/user/doLogin", "post", res => {
  return Mock.mock({
    code: 1,
    messge: "@csentence(6, 15)",
    result: {

    }
  })
})