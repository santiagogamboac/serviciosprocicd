import { screen, render } from "@testing-library/react"
import ContactPage from "@/app/contact/page"


describe("Contacto Page", () => {
    it("renders the ContactPage component", () => {
        //const { getByTestId } =
        render(<ContactPage />)
        expect(screen.getByText("Contáctanos")).toBeInTheDocument()

    })
})