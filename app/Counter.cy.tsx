import React from "react";
import Counter from "./Counter";

describe("<Counter /> 컴포넌트", () => {
  it("렌더 테스트", () => {
    cy.mount(<Counter />);
    const plusButton = cy.get(".plus");
    const minusButton = cy.get(".minus");
    const count = cy.get(".count");
    plusButton.should("exist");
    minusButton.should("exist");
    count.should("exist").should("have.text", 0);
  });

  it("플러스 클릭 테스트", () => {
    cy.mount(<Counter />);
    cy.get(".plus").click();
    cy.get(".count").should("have.text", 1);
  });

  it("마이너스 클릭 테스트", () => {
    cy.mount(<Counter />);
    cy.get(".minus").click();
    cy.get(".count").should("have.text", -1);
  });
});
