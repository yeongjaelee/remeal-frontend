import React from "react";
import NavLayout from "../NavLayout";
describe("<NavLayout /> 컴포넌트", () => {
    it("홈페이지 클릭 테스트", () => {
        cy.mount(<NavLayout />);
        const homepageButton = cy.get(".homepageButton");
        homepageButton.should("exist");
        homepageButton.click();
        const loginButton = cy.get
    });
});
