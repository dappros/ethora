import React from "react"
import renderer from "react-test-renderer"
import { MainHeader } from "../../src/components/MainHeader/MainHeader"
import { StoreProvider } from "../../src/stores/context"
import { HeaderBalanceButton } from "../../src/components/MainHeader/HeaderBalanceButton"

test("renders correctly", () => {
  const MainHeaderTree = renderer
    .create(
      <StoreProvider>
        <MainHeader />
      </StoreProvider>
    )
    .toJSON()
  expect(MainHeaderTree).toMatchSnapshot()

  // const HeaderBalanceButtonTree = renderer.create(<HeaderBalanceButton/>).toJSON();
  // expect(HeaderBalanceButtonTree).toMatchSnapshot();
})

test.skip("Is this needed?", () => {})

// it("get instance", () => {
//     let MainHeaderData = renderer.create(<MainHeader/>).getInstance();

// })
