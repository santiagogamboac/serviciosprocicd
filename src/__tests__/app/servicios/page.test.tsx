import { screen, render } from "@testing-library/react"
import ServiciosPage from "../../../app/services/page"


describe("Servicios Page", () => {
    it("renders the ServiciosGestion component", () => {
        //const { getByTestId } =
        render(<ServiciosPage />)

        expect(screen.getByText("Nuestros Servicios")).toBeInTheDocument()

    })
})
