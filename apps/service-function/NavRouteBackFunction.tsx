export default (routeAsal,options)=>{
    let router = options;
    router={
        ...router,
        navBack:routeAsal
    }
    //console.log(router);
    return router;
}