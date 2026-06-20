function generate(events) {

    let code = `
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

public class RecordedTest {

    public static void main(String[] args) {

        WebDriver driver = new ChromeDriver();

        try {
`;

    for (const event of events) {

        switch (event.type) {

            case "navigate":

                code += `
            driver.get("${event.url}");
`;
                break;

            case "click":

                code += `
            driver.findElement(
                By.cssSelector("${event.selector}")
            ).click();
`;
                break;

            case "input":

                code += `
            driver.findElement(
                By.cssSelector("${event.selector}")
            ).sendKeys("${event.value}");
`;
                break;

            default:
                break;
        }
    }

    code += `

        } finally {

            driver.quit();

        }

    }

}
`;

    return code;
}

module.exports = {
    generate
};