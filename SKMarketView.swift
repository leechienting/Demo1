//
//  SKMarketView.swift
//  SKBankX
//
//  Created by APP技術部-周旻鋒 on 2023/4/17.
//
//  Change Log:
//  2026/01/26: Initial version control comment added by Gemini.
//

import UIKit
import RxSwift
import RxCocoa
import RxDataSources
import Stevia
import RxGesture

class SKMarketView: UIView {
    
    public var bag = DisposeBag()
    
    public lazy var marketDataRelay: PublishRelay<[SKMarketSection]> = PublishRelay()
    
    public var tapCellRelay = PublishRelay<MarketViewType>()

    private let cellIdentifier = "SKMarketCell"

    // MARK: - Layout Constants
    private let estimatedCellHeight: CGFloat = 98
    private let horizontalPadding: CGFloat = 16
    private let titleHeight: CGFloat = 24
    private let titleTrailingPadding: CGFloat = 21
    private let titleBottomSpacing: CGFloat = 16
    private let tableViewInitialHeight: CGFloat = 1
    
    private lazy var dataSource = RxTableViewSectionedReloadDataSource<SKMarketSection>{
        dataSource, tableView, indexPath, element in
        let cell = tableView.dequeueReusableCell(withIdentifier: self.cellIdentifier, for: indexPath) as! SKMarketCell
        cell.setContent(data: element)
        cell.selectionStyle = .none
        cell.accessoryType = .none
        return cell
    }
    
    private lazy var lblTitle: UILabel = {
        let label = UILabel()
        label.font = SKFont.font(nameType: .System, weightType: .medium, fontSize: 18)
        label.text = "InvestHome.SKMarketView.lblTitle".localized
        label.textAlignment = .left
        return label
    }()
    
    public lazy var tbViewList: UITableView = {
        let tbView = UITableView()
        tbView.register(SKMarketCell.self, forCellReuseIdentifier: cellIdentifier)
        tbView.estimatedRowHeight = self.estimatedCellHeight
        tbView.bounces = false
        tbView.separatorStyle = .none
        tbView.isScrollEnabled = false
        tbView.tableFooterView = UIView(frame: .zero)
        tbView.rowHeight = UITableView.automaticDimension
        if #available(iOS 15.0, *) {
            tbView.sectionHeaderTopPadding = 0
        }
        return tbView
    }()
    
    init() {
        super.init(frame: .zero)
        self.setupView()
        self.bindView()
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func layoutSubviews() {
        super.layoutSubviews()
        self.applyTheme()
    }
    
    private func setupView() {
        self.subviews(
            self.lblTitle,
            self.tbViewList
        )
        
        self.setupLayout()
        self.applyTheme()
    }
    
    private func setupLayout() {

        self.layout(
            0,
            |-self.horizontalPadding⁃self.lblTitle.height(self.titleHeight)⁃self.titleTrailingPadding-|,
            self.titleBottomSpacing,
            |-0⁃self.tbViewList.height(self.tableViewInitialHeight)⁃0-|,
            0
        )

    }
    
    private func applyTheme() {
        let current = Theme.shard.current
        self.lblTitle.textColor = current.Color_SpaceGray1_CalmBlue7
        self.lblTitle.text = "abc"
    }
    
    private func bindView() {
        // 監聽高度變化
        self.tbViewList.rx.observe(CGSize.self, #keyPath(UITableView.contentSize))
            .asObservable()
            .compactMap{ $0 }
            .observe(on: MainScheduler.instance)
            .withUnretained(self)
            .subscribe(onNext: { owner, result in
                owner.tbViewList.heightConstraint?.constant = result.height
            })
            .disposed(by: self.bag)
        
        self.marketDataRelay
            .observe(on: MainScheduler.instance)
            .bind(to: self.tbViewList.rx.items(dataSource: self.dataSource))
            .disposed(by: self.bag)
        
        self.tbViewList
            .rx
            .modelSelected(SKMarketRow.self)
            .map({ $0.title })
            .bind(to: self.tapCellRelay)
            .disposed(by: self.bag)
    }

    public func helloWorld() {
        print("Hello World")
    }
}
