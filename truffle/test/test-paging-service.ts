import { PagingService } from '../../js/services/util/paging-service';
import assert = require('assert');



//@ts-ignore
contract('PagingService', async (accounts) => {


    let pagingSevice: PagingService = new PagingService()

    //@ts-ignore
    it("Test buildPagingViewModel", async () => {

        //Act
        let page = pagingSevice.buildPagingViewModel(70, 10, 3723)

        //Assert
        assert.equal(page.offset, 70)
        assert.equal(page.limit, 10)
        assert.equal(page.count, 3723)
        assert.equal(page.start, 71)
        assert.equal(page.end, 80)
        assert.equal(page.nextOffset, 80)
        assert.equal(page.previousOffset, 60)

    })


})


