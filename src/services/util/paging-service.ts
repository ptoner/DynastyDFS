class PagingService {
    constructor() {}

    buildPagingViewModel(offset: number, limit: number, count: number) : PagingViewModel {

        let viewModel = new PagingViewModel()

        viewModel.offset = offset ? offset : 0
        viewModel.limit = limit
        viewModel.count = count 

        viewModel.start = viewModel.offset + 1


        viewModel.end = Math.min(viewModel.offset + limit, count) 

        viewModel.previousOffset = Math.max(viewModel.offset-limit, 0);

        if ( (viewModel.offset + limit) < count -1) {
            viewModel.nextOffset = viewModel.offset + limit
        }


        return viewModel
    }

}

class PagingViewModel {
    offset: number
    limit: number
    count: number

    start: number
    end: number 

    previousOffset: number 
    nextOffset: number 

}

export {
    PagingService,
    PagingViewModel
}